/**
 * Cập nhật style in ấn động trong <head> để đảm bảo mọi trình duyệt (Chrome, Edge, Safari)
 * nhận diện đúng 100% hướng trang in: A4 Ngang (Landscape) hoặc A4 Đứng (Portrait).
 */
export function updatePrintHeadStyle(isLandscape: boolean) {
  let styleTag = document.getElementById('a4-dynamic-print-style') as HTMLStyleElement | null;
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'a4-dynamic-print-style';
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
    @media print {
      @page {
        size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'};
        margin: 3.5mm !important;
      }
      *, [filter], .card-shadow-filter {
        filter: none !important;
        -webkit-filter: none !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }
      html, body {
        width: ${isLandscape ? '297mm' : '210mm'} !important;
        height: ${isLandscape ? '210mm' : '297mm'} !important;
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
        overflow: hidden !important;
      }
      #app-root, main, .print-wrapper {
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: white !important;
      }
      .a4-paper {
        width: ${isLandscape ? '290mm' : '203mm'} !important;
        height: ${isLandscape ? '203mm' : '290mm'} !important;
        max-width: ${isLandscape ? '290mm' : '203mm'} !important;
        max-height: ${isLandscape ? '203mm' : '290mm'} !important;
        box-shadow: none !important;
        border: none !important;
        margin: 0 auto !important;
        padding: 0 !important;
        aspect-ratio: unset !important;
        page-break-before: avoid !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
        break-before: avoid !important;
        break-after: avoid !important;
        break-inside: avoid !important;
      }
    }
  `;
}

/**
 * In Trực Tiếp: Sử dụng trực tiếp hộp thoại in native của trình duyệt.
 * Không sử dụng iframe hay timer ngầm để cửa sổ in không bao giờ bị tự đóng khi người dùng chọn máy in.
 */
export const handlePrint = (isLandscape: boolean = false) => {
  updatePrintHeadStyle(isLandscape);
  window.print();
};

/**
 * Tạo đối tượng jsPDF dùng cho Xuất PDF
 */
async function buildPdf(isLandscape: boolean) {
  const element = document.getElementById('a4-print-area');
  if (!element) return null;

  // Lưu lại các thuộc tính inline ban đầu của element
  const originalWidth = element.style.width;
  const originalHeight = element.style.height;
  const originalMaxWidth = element.style.maxWidth;
  const originalAspectRatio = element.style.aspectRatio;
  const originalShadow = element.style.boxShadow;
  const originalTransition = element.style.transition;

  // Tạm thời cố định kích thước chuẩn A4 (mm) để html2canvas chụp sắc nét 100% đúng tỉ lệ vật lý
  element.style.boxShadow = 'none';
  element.style.transition = 'none';
  element.style.aspectRatio = 'unset';
  if (isLandscape) {
    element.style.width = '297mm';
    element.style.height = '210mm';
    element.style.maxWidth = '297mm';
  } else {
    element.style.width = '210mm';
    element.style.height = '297mm';
    element.style.maxWidth = '210mm';
  }

  try {
    const html2pdf = (await import('html2pdf.js')).default;
    const opt = {
      margin: 0,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.offsetWidth,
        windowHeight: element.offsetHeight,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: isLandscape ? 'landscape' : 'portrait',
      },
      pagebreak: { mode: 'avoid-all' },
    };

    const worker = (html2pdf as any)().set(opt).from(element);
    const pdf = await worker.toPdf().get('pdf');

    // Xóa triệt để các trang trắng thừa nếu phát sinh
    while (pdf.internal.getNumberOfPages() > 1) {
      pdf.deletePage(pdf.internal.getNumberOfPages());
    }

    return pdf;
  } finally {
    // Phục hồi lại toàn bộ style ban đầu để giao diện responsive xem trước trên màn hình không bị xáo trộn
    element.style.width = originalWidth;
    element.style.height = originalHeight;
    element.style.maxWidth = originalMaxWidth;
    element.style.aspectRatio = originalAspectRatio;
    element.style.boxShadow = originalShadow;
    element.style.transition = originalTransition;
  }
}

/**
 * Xuất file PDF để lưu về máy
 */
export const handleExportPDF = async (isLandscape: boolean) => {
  try {
    const pdf = await buildPdf(isLandscape);
    if (!pdf) return;
    pdf.save(`flowercard-${isLandscape ? 'landscape' : 'portrait'}.pdf`);
  } catch (err) {
    console.error('Lỗi khi xuất PDF:', err);
    alert('Có lỗi khi tạo file PDF. Bạn có thể dùng tính năng "In Trực Tiếp" và chọn "Lưu dạng PDF".');
  }
};
