import { Request, Response } from 'express';
import { XMLValidator, XMLParser } from 'fast-xml-parser';
import { parseYieldData } from '../utils.js';
import { prisma } from '../db.js';
import axios from 'axios';

export const getYieldData = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-indexed
    const url = `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_yield_curve&field_tdr_date_value_month=${year}${month}`;
    
    const response = await axios.get(url,
      { headers: { Accept: 'application/xml' } }
    );
    const result = XMLValidator.validate(response.data);
    
    if(result === true) {
      const parser = new XMLParser();
      const json = parser.parse(response.data);
      const entries = json.feed.entry;

      if (!entries || !Array.isArray(entries) || entries.length === 0) {
        return res.status(500).json({ error: 'No yield data entries found' });
      }

      const sortedEntries = entries.sort((a: any, b: any) => {
        const dateA = new Date(a?.content['m:properties']['d:NEW_DATE']);
        const dateB = new Date(b?.content['m:properties']['d:NEW_DATE']);
        return dateB.getTime() - dateA.getTime();
      });

      const latestEntry = sortedEntries[0];
      const yieldData = await parseYieldData(latestEntry.content);
      
      res.json(yieldData);
    } else {
      throw new Error('XML IS NOT VALID');
    }
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ error: `Failed to fetch yield data: ${error}` });
  }
}

export const getOrders = async (req: Request, res: Response) => {
	try {
		const orders = await prisma.order.findMany({
			orderBy: { createdAt: 'desc' }
		});
		res.json(orders);
	} catch (error) {
    console.log('error', error);
		res.status(500).json({ error: 'Failed to fetch orders' });
	}
}

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { term_years, amount, rate } = req.body;

    if (!term_years || !amount) {
      return res.status(400).json({ error: 'term_years and amount are required' });
    }

    // Validate term is a valid treasury term
    const validTerms = [
      "1 Month", "1.5 Months", "2 Months", "3 Months", "4 Months", "6 Months",
      "1 Year", "2 Years", "3 Years", "5 Years", "7 Years", "10 Years", "30 Years"
    ];
    
    if (!validTerms.includes(term_years)) {
      return res.status(400).json({ 
        error: 'Invalid term. Must be one of: ' + validTerms.join(', ') 
      });
    }

    // Validate amount
    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    const result = await prisma.order.create({
      data: {
        term: term_years.toString(), 
        amount: Math.round(amountNum),
        rate: rate, 
        createdBy: 'system',
      }
    });
    
    res.status(201).json({ 
      id: result.id,
      term: result.term,
      amount: result.amount,
      rate: result.rate, // Include the rate in response
      createdAt: result.createdAt
    });

  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
}
