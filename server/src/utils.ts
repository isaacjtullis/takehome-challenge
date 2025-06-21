interface TreasuryContent {
  'd:NEW_DATE': string;
  'd:BC_1MONTH': string;
  'd:BC_3MONTH': string;
  'd:BC_6MONTH': string;
  'd:BC_1YEAR': string;
  'd:BC_2YEAR': string;
  'd:BC_10YEAR': string;
  [key: string]: string; // Allow other properties
}

export async function parseYieldData(yieldData: TreasuryContent) {
    let data = yieldData['m:properties'];
      const curveData = Object.entries(data)
    .filter(([key]) => key.startsWith('d:') && key !== 'd:BC_30YEARDISPLAY' && key !== 'd:Id')
    .map(([key, value]) => {
      if (key === 'd:NEW_DATE') {
        return {
            label: 'date',
            value: value
        }
      }
      const label = key
      .replace('d:BC_', '')
      .replace('d:', '')         // remove prefix
      .replace('MONTH', '_Month')   // format units
      .replace('YEAR', '_Year')     // format units         // optional: replace underscores with dots
      .replace('1_5', '1.5');       // keep 1.5 intact
      return {
        label,
        value
      }
    });
    return curveData;
  }