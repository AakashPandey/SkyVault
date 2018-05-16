const fs = require('fs');
const yargs = require('yargs');
const crypto = require('crypto');

const argv = yargs.argv
const op = argv._[0];

console.log("\nSkyVault - 1.0.1")
console.log("\nCreated by: Aakash Pandey\n");

if(!argv.file || !argv.key ) {
    console.log(' To Encrypt: [vault / v / ] --file=file.ext --key=secret-key\n');
    console.log(' To Decrypt: [unvault / uv ] --file=file.ext --key=secret-key\n');
    process.exit();
}

var file = argv.file;
const key = String(argv.key);

fs.stat(file, (e) => {
    if(e) {
        console.log(`Err: Unable to read ${file}`);
        process.exit();
    } else {
        vault();
    }
})

var vault = () => {
    const input = fs.createReadStream(file);
    if(op==="vault" || op==="v" || !op) { 
        const cipher = crypto.createCipher('aes192', key);
        const output = fs.createWriteStream(file+'.enc');
        input.pipe(cipher).pipe(output);
        console.log(`Encrypted successfully to ${file}.enc`);
        console.log('\nNote: Remember the key & feel free to delete the source file.\n')
    } else if(op==="unvault" || op==="uv") {
        file = file.split(".");
        const decipher = crypto.createDecipher('aes192', key);
        const output = fs.createWriteStream(file[0]+"."+file[1]);
        input.pipe(decipher).on('error', () => {
            console.log("Err: Incorrect key or damaged source file\n");
            process.exit();
        }).pipe(output).on('finish', () => {
            console.log(`Decrypted successfully to ${file[0]}.${file[1]}\n`)
        });        
    }
}
