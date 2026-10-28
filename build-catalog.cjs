const fs=require('node:fs'),z=require('node:zlib');
const raw=JSON.parse(z.gunzipSync(fs.readFileSync('nse-master.json.gz'))),stocks=new Map();
for(const r of raw.filter(r=>r.segment==='NSE_EQ'&&['EQ','BE','BZ','SM','ST','SZ'].includes(r.instrument_type)))if(!stocks.has(r.trading_symbol)||r.instrument_type==='EQ')stocks.set(r.trading_symbol,{symbol:r.trading_symbol,name:r.name,key:r.instrument_key,series:r.instrument_type,contracts:[]});
for(const r of raw.filter(r=>r.segment==='NSE_FO'&&['CE','PE'].includes(r.instrument_type)&&r.underlying_type==='EQUITY')){const s=stocks.get(r.underlying_symbol);if(s)s.contracts.push([r.expiry,r.strike_price,r.instrument_type,r.lot_size,r.instrument_key]);}
const catalog={source:'https://assets.upstox.com/market-quote/instruments/exchange/NSE.json.gz',retrievedAt:new Date().toISOString(),stocks:[...stocks.values()].sort((a,b)=>a.symbol.localeCompare(b.symbol))};
fs.writeFileSync('dist/catalog.js','window.NSE_CATALOG='+JSON.stringify(catalog)+';');
console.log(`${catalog.stocks.length} NSE equity symbols; ${catalog.stocks.filter(s=>s.contracts.length).length} with option contracts in snapshot.`);
