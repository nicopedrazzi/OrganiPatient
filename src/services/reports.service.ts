import { PDFParse } from "pdf-parse";


export async function parseUploadedPdfFile(path:string){
    const parser = new PDFParse({ url: 'https://bitcoin.org/bitcoin.pdf' });
    const result = await parser.getText()
    console.log("testing: if you see this you are logged in and have permission to use!")
}

//TODO : add authorization differentiation (segregation), setup cookies, setup testing, test all the basic auth stuff
// then start with pdf parsing, etc.