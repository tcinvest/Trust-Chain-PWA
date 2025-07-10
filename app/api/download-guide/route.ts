// app/api/download-guide/route.ts
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // Get the file path from the public directory
    const filePath = path.join(process.cwd(), 'public', 'guide.pdf');
    
    // Read the file
    const fileBuffer = await readFile(filePath);
    
    // Return the file with proper headers for download
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Investment Guide.pdf"',
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error downloading guide:', error);
    return new Response('File not found', { status: 404 });
  }
}