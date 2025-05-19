/**
 * Custom PDF parser that doesn't rely on the problematic pdf-parse library
 */
export async function customParsePdf(buffer: Buffer): Promise<string> {
  try {
    // Since we can't use pdf-parse due to the test file issue,
    // we'll implement a basic text extraction method
    
    // Convert buffer to string and try to extract text
    // This is a simplified approach - in production you'd want a more robust solution
    const bufferString = buffer.toString('utf-8', 0, buffer.length);
    
    // Try to extract text by looking for patterns in the PDF content
    // This is a very simple approach and may not work for all PDFs
    let extractedText = "";
    
    // Look for text between common PDF text markers
    const textMatch = bufferString.match(/BT\s*(.*?)\s*ET/g);
    if (textMatch && textMatch.length > 0) {
      extractedText = textMatch.join(' ')
        .replace(/[\\()]/g, ' ')  // Remove PDF special chars
        .replace(/\s+/g, ' ')     // Normalize whitespace
        .trim();
    } else {
      // Fallback to just trying to extract readable characters
      extractedText = bufferString
        .replace(/[^\x20-\x7E]/g, ' ')  // Keep only printable ASCII
        .replace(/\s+/g, ' ')           // Normalize whitespace
        .trim();
    }
    
    return extractedText || "Unable to extract text from this PDF. Please try pasting the content directly.";
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. Please ensure it is a valid PDF file or paste the text directly.');
  }
}