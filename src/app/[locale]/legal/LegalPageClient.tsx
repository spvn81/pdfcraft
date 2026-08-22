'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { type Locale } from '@/lib/i18n/config';

interface LegalPageClientProps {
  locale: Locale;
}

export default function LegalPageClient({ locale }: LegalPageClientProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header locale={locale} />
      
      <main className="flex-1 py-12 pt-24 bg-[hsl(var(--color-muted)/0.3)]">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-[hsl(var(--color-foreground))] mb-8">
            Open Source & Legal Information
          </h1>

          <Card className="p-8 mb-8 prose dark:prose-invert max-w-none">
            <h2>Modified Version Notice</h2>
            <p>
              This application ("SPVN Tech PDF Tools") is a modified version of the original PDFCraft project.
              We have adapted the software and deployed it for use as part of the SPVN Tech suite of tools.
            </p>

            <h2>Upstream Attribution</h2>
            <p>
              The original PDFCraft project was created by the PDFCraft Team. 
              We are grateful to the original creators and contributors for their work in building the foundations of this software.
            </p>

            <h2>License (AGPL-3.0)</h2>
            <p>
              This software is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).
              Under the terms of the AGPL, users interacting with this software over a network are entitled to receive the corresponding source code of this modified version.
            </p>
            <p>
              <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--color-primary))] hover:underline">
                Read the full AGPL-3.0 License Text
              </a>
            </p>

            <h2>Source Code Availability</h2>
            <p>
              You can find the original PDFCraft source code repository at:
              <br />
              <a href="https://github.com/PDFCraftTool/pdfcraft" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--color-primary))] hover:underline">
                https://github.com/PDFCraftTool/pdfcraft
              </a>
            </p>
            <p>
              The source code for this modified version (SPVN Tech PDF Tools) is publicly available at:
              <br />
              <a href="https://github.com/spvn81/pdfcraft" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--color-primary))] hover:underline">
                https://github.com/spvn81/pdfcraft
              </a>
            </p>
          </Card>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
