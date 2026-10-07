
require("dotenv").config();
const {Pool}=require("pg");
(async()=>{
 if(!process.env.DATABASE_URL){console.error("DATABASE_URL belum diisi");process.exit(1)}
 const pool=new Pool({connectionString:process.env.DATABASE_URL});
 try{const r=await pool.query("select now() as now");console.log("PostgreSQL OK:",r.rows[0].now)}
 catch(e){console.error(e.message);process.exit(1)}
 finally{await pool.end()}
})();
