require('dotenv').config();
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {Pool}=require('pg');
if(!process.env.DATABASE_URL){console.error('DATABASE_URL belum diisi.');process.exit(1)}
const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.NODE_ENV==='production'?{rejectUnauthorized:false}:false});
const id=p=>'${p}_${crypto.randomBytes(5).toString("hex")}'.replace("'","");
(async()=>{
 try{
  const schema=fs.readFileSync(path.join(__dirname,'..','schema.sql'),'utf8');
  await pool.query(schema);
  const products=JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','products.json'),'utf8'));
  for(const p of products){await pool.query(`INSERT INTO products(id,name,price,category,emoji,stock,description) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,price=EXCLUDED.price,category=EXCLUDED.category,emoji=EXCLUDED.emoji,stock=EXCLUDED.stock,description=EXCLUDED.description,updated_at=now()`,[p.id,p.name,p.price,p.category||'Soft',p.emoji||'💅🏻',p.stock||0,p.description||''])}
  console.log(`Schema siap. ${products.length} produk disinkronkan.`);
 }catch(e){console.error(e);process.exitCode=1}finally{await pool.end()}
})();
