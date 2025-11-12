import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CategoryData {
  id: string;
  name: string;
  score: number;
  weight: number;
  trend: string;
  color: string;
  metrics: Array<{
    label: string;
    value: string;
    status: string;
  }>;
}

interface InsightData {
  type: string;
  message: string;
  action: string;
}

interface BrandHealthData {
  overallScore: number;
  trend: string;
  lastUpdated: string;
  categories: CategoryData[];
  insights: InsightData[];
}

const getTierInfo = (score: number) => {
  if (score >= 90) return { tier: 'Excellent', color: '#16a34a' };
  if (score >= 75) return { tier: 'Strong', color: '#eab308' };
  if (score >= 60) return { tier: 'Needs Attention', color: '#f97316' };
  return { tier: 'Critical', color: '#dc2626' };
};

export const exportBrandHealthPDF = async (data: BrandHealthData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add page
  const addNewPage = () => {
    pdf.addPage();
    yPosition = margin;
  };

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      addNewPage();
    }
  };

  // Cover Page
  pdf.setFillColor(92, 10, 58); // Qatar maroon
  pdf.rect(0, 0, pageWidth, 80, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(32);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Brand Health Report', pageWidth / 2, 35, { align: 'center' });
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Qatar Airways', pageWidth / 2, 50, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.text(`Generated on ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, pageWidth / 2, 65, { align: 'center' });

  // Overall Score Section
  yPosition = 100;
  const tierInfo = getTierInfo(data.overallScore);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Overall Brand Health Score', margin, yPosition);
  
  yPosition += 15;
  
  // Score circle representation
  pdf.setDrawColor(92, 10, 58);
  pdf.setLineWidth(5);
  pdf.circle(pageWidth / 2, yPosition + 25, 25, 'S');
  
  pdf.setFontSize(36);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.overallScore.toString(), pageWidth / 2, yPosition + 30, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('out of 100', pageWidth / 2, yPosition + 38, { align: 'center' });
  
  yPosition += 60;
  
  // Tier information
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(tierInfo.color);
  pdf.text(`Status: ${tierInfo.tier}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Trend: ${data.trend} vs last month`, pageWidth / 2, yPosition, { align: 'center' });
  
  // Category Breakdown
  addNewPage();
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Category Breakdown', margin, yPosition);
  yPosition += 12;

  data.categories.forEach((category, index) => {
    checkPageBreak(45);
    
    // Category header
    pdf.setFillColor(240, 240, 245);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(category.name, margin + 3, yPosition + 5.5);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text(`Score: ${category.score}/100`, pageWidth - margin - 30, yPosition + 5.5);
    
    yPosition += 12;
    
    // Weight and trend
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Weight: ${category.weight}%`, margin + 3, yPosition);
    pdf.text(`Trend: ${category.trend}%`, margin + 40, yPosition);
    
    yPosition += 8;
    
    // Progress bar
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.5);
    pdf.rect(margin + 3, yPosition, pageWidth - 2 * margin - 6, 4);
    
    pdf.setFillColor(92, 10, 58);
    const progressWidth = ((pageWidth - 2 * margin - 6) * category.score) / 100;
    pdf.rect(margin + 3, yPosition, progressWidth, 4, 'F');
    
    yPosition += 10;
    
    // Metrics
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    category.metrics.forEach((metric) => {
      const statusColor = metric.status === 'excellent' ? '#16a34a' : 
                         metric.status === 'good' ? '#3b82f6' : '#f97316';
      pdf.setTextColor(60, 60, 60);
      pdf.text(`• ${metric.label}:`, margin + 5, yPosition);
      pdf.setTextColor(statusColor);
      pdf.text(metric.value, margin + 80, yPosition);
      yPosition += 5;
    });
    
    yPosition += 5;
  });

  // AI Insights & Recommendations
  addNewPage();
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('AI Insights & Recommendations', margin, yPosition);
  yPosition += 12;

  data.insights.forEach((insight, index) => {
    checkPageBreak(30);
    
    const typeColor = insight.type === 'success' ? '#16a34a' : 
                     insight.type === 'warning' ? '#f97316' : '#3b82f6';
    
    pdf.setFillColor(typeColor);
    pdf.circle(margin + 3, yPosition - 1, 2, 'F');
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    const typeLabel = insight.type.charAt(0).toUpperCase() + insight.type.slice(1);
    pdf.text(typeLabel, margin + 8, yPosition);
    
    yPosition += 6;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    const lines = pdf.splitTextToSize(insight.message, pageWidth - 2 * margin - 10);
    pdf.text(lines, margin + 8, yPosition);
    yPosition += lines.length * 5;
    
    pdf.setFontSize(9);
    pdf.setTextColor(92, 10, 58);
    pdf.text(`→ ${insight.action}`, margin + 8, yPosition);
    
    yPosition += 12;
  });

  // Footer on last page
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text('Pixify DAM - Brand Health Analytics', pageWidth / 2, pageHeight - 10, { align: 'center' });
  pdf.text('Confidential - For Internal Use Only', pageWidth / 2, pageHeight - 6, { align: 'center' });

  // Save the PDF
  const fileName = `Qatar_Airways_Brand_Health_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};
