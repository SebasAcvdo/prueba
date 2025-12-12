import { useState } from 'react';
import { TbDownload } from 'react-icons/tb';
import { Button } from './Button';
import toast from 'react-hot-toast';

export const PdfDownload = ({ fileName, fetchPdf, buttonText = 'Descargar PDF', ...buttonProps }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const blob = await fetchPdf();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('PDF descargado exitosamente');
    } catch (error) {
      toast.error('Error al descargar el PDF');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      icon={TbDownload}
      onClick={handleDownload}
      loading={loading}
      {...buttonProps}
    >
      {buttonText}
    </Button>
  );
};
