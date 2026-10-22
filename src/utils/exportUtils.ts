/**
 * In Trực Tiếp: Sử dụng trực tiếp hộp thoại in native của trình duyệt.
 * Không sử dụng iframe hay timer ngầm để cửa sổ in không bao giờ bị tự đóng khi người dùng chọn máy in.
 */
export const handlePrint = (_isLandscape: boolean = false) => {
  window.print();
};

/**
 * Tạo đối tượng jsPDF dùng cho Xuất PDF
 */
async function buildPdf(isLandscape: boolean) {
  const element = document.getElementById('a4-print-area');
  if (!element) return null;

  const originalShadow = element.style.boxShadow;
  const originalTransition = element.style.transition;

  // Tắt tạm thời box-shadow và transition để chụp sắc nét, không bị bóng mờ làm tràn lề
  element.style.boxShadow = 'none';
  element.style.transition = 'none';

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
        format: isLandscape ? [297, 210] : [210, 297],
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
