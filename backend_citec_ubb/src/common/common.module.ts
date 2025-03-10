import { Module } from '@nestjs/common';
import { PdfGeneratorService } from './services/pdf-generator.service';

@Module({
    providers: [PdfGeneratorService],
    exports: [PdfGeneratorService], // Export so other modules can use it
})
export class CommonModule {}
