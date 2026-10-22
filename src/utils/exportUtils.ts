/**
 * Tạo đối tượng jsPDF dùng chung cho cả Xuất PDF và In Trực Tiếp
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
 * In Trực Tiếp: Sử dụng luồng PDF để kích thước bản in và dung lượng file
 * chuyển qua máy in chuẩn xác 100% như khi lưu PDF rồi in.
 */
export const handlePrint = async (isLandscape: boolean = false) => {
  try {
    const pdf = await buildPdf(isLandscape);
    if (!pdf) {
      window.print();
      return;
    }

    // Nhúng lệnh in tự động vào PDF
    pdf.autoPrint();
    const blob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(blob);

    // Dùng hidden iframe để in file PDF trực tiếp
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '-10000px';
    iframe.style.left = '-10000px';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.border = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);

    let printed = false;

    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          printed = true;
        } catch (e) {
          console.warn('Iframe PDF print blocked by browser, falling back to window.print():', e);
          window.print();
        } finally {
          setTimeout(() => {
            try {
              document.body.removeChild(iframe);
              URL.revokeObjectURL(blobUrl);
            } catch {}
          }, 4000);
        }
      }, 350);
    };

    // Đề phòng trường hợp iframe không kích hoạt onload trên một số trình duyệt
    setTimeout(() => {
      if (!printed) {
        window.print();
        try {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(blobUrl);
        } catch {}
      }
    }, 2500);

  } catch (err) {
    console.error('Lỗi khi in qua luồng PDF, chuyển về in chuẩn trình duyệt:', err);
    window.print();
  }
};

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
