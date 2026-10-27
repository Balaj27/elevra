import fs from 'node:fs/promises';
export async function writeGenerated(path,content){
 try{if(await fs.readFile(path,'utf8')===content)return;}catch{}
 for(let attempt=0;attempt<12;attempt++){
  try{await fs.writeFile(path,content);return;}
  catch(error){if(attempt===11||!['UNKNOWN','EPERM','EBUSY','EACCES'].includes(error.code))throw error;await new Promise(resolve=>setTimeout(resolve,150*(attempt+1)));}
 }
}
