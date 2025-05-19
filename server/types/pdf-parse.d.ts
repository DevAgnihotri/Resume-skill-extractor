declare module 'pdf-parse' {
  function pdfParse(
    buffer: Buffer, 
    options?: {
      pagerender?: (pageData: any) => Promise<string>;
      max?: number;
      version?: string;
    }
  ): Promise<{
    text: string;
    numpages: number;
    info: any;
    metadata: any;
    version: string;
  }>;
  
  export default pdfParse;
}