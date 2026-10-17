export const handlePrint = () => {
  window.print();
};

export const handleExportPDF = async (isLandscape: boolean) => {
  const element = document.getElementById('a4-print-area');
  if (!element) return;

  const originalShadow = element.style.boxShadow;
  const originalTransition = element.style.transition;

  // Tắt tạm thời box-shadow và transition để html2canvas không chụp dính bóng mờ làm tràn sang trang 2
  element.style.boxShadow = 'none';
  element.style.transition = 'none';

  try {
    const html2pdf = (await import('html2pdf.js')).default;
    const opt = {
      margin: 0,
      filename: `flowercard-${isLandscape ? 'landscape' : 'portrait'}.pdf`,
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

    await (html2pdf as any)()
      .set(opt)
      .from(element)
      .toPdf()
      .get('pdf')
      .then((pdf: any) => {
        // Xóa triệt để mọi trang trắng thừa nếu phát sinh do làm tròn sub-pixel
        while (pdf.internal.getNumberOfPages() > 1) {
          pdf.deletePage(pdf.internal.getNumberOfPages());
        }
      })
      .save();
  } catch (err) {
    console.error('Lỗi khi xuất PDF:', err);
    alert('Có lỗi khi tạo file PDF. Bạn có thể dùng tính năng "In Trực Tiếp" và chọn "Lưu dạng PDF".');
  } finally {
    // Phục hồi lại hiệu ứng bóng mờ ban đầu cho giao diện xem trước
    element.style.boxShadow = originalShadow;
    element.style.transition = originalTransition;
  }
};
