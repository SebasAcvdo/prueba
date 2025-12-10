package co.udistrital.academia.util;

import co.udistrital.academia.entity.Calificacion;
import co.udistrital.academia.entity.Estudiante;
import co.udistrital.academia.entity.Grupo;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Component
public class PdfGenerator {

    public byte[] generarListadoGrupo(Grupo grupo) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Título
            Paragraph title = new Paragraph("Listado del Grupo: " + grupo.getNombre())
                    .setFontSize(18)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(title);

            Paragraph info = new Paragraph("Grado: " + grupo.getGrado() + 
                    " | Profesor: " + grupo.getProfesor().getNombre() +
                    " | Capacidad: " + grupo.getEstudiantes().size() + "/" + grupo.getCapacidad())
                    .setFontSize(12)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(info);

            document.add(new Paragraph("\n"));

            // Tabla
            float[] columnWidths = {1, 3, 3, 2, 2};
            Table table = new Table(UnitValue.createPercentArray(columnWidths));
            table.setWidth(UnitValue.createPercentValue(100));

            // Headers
            table.addHeaderCell("No.");
            table.addHeaderCell("Nombre");
            table.addHeaderCell("Apellido");
            table.addHeaderCell("Grado");
            table.addHeaderCell("Estado");

            // Datos
            int index = 1;
            for (Estudiante est : grupo.getEstudiantes()) {
                table.addCell(String.valueOf(index++));
                table.addCell(est.getNombre());
                table.addCell(est.getApellido());
                table.addCell(est.getGrado());
                table.addCell(est.getEstado().name());
            }

            document.add(table);
            document.close();

            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generando PDF de listado: " + e.getMessage(), e);
        }
    }

    public byte[] generarBoletin(Estudiante estudiante, List<Calificacion> calificaciones, Integer periodo) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Título
            Paragraph title = new Paragraph("Boletín de Calificaciones")
                    .setFontSize(18)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(title);

            // Información del estudiante
            Paragraph info = new Paragraph(
                    "Estudiante: " + estudiante.getNombre() + " " + estudiante.getApellido() + "\n" +
                    "Grado: " + estudiante.getGrado() + "\n" +
                    "Periodo: " + (periodo != null ? periodo : "Todos"))
                    .setFontSize(12);
            document.add(info);

            document.add(new Paragraph("\n"));

            // Tabla de calificaciones
            float[] columnWidths = {4, 2, 2, 2};
            Table table = new Table(UnitValue.createPercentArray(columnWidths));
            table.setWidth(UnitValue.createPercentValue(100));

            // Headers
            table.addHeaderCell("Logro");
            table.addHeaderCell("Categoría");
            table.addHeaderCell("Periodo");
            table.addHeaderCell("Calificación");

            // Datos
            double suma = 0;
            for (Calificacion cal : calificaciones) {
                table.addCell(cal.getLogro().getNombre());
                table.addCell(cal.getLogro().getCategoria().name());
                table.addCell(String.valueOf(cal.getPeriodo()));
                table.addCell(String.format("%.2f", cal.getValor()));
                suma += cal.getValor();
            }

            document.add(table);

            // Promedio
            if (!calificaciones.isEmpty()) {
                double promedio = suma / calificaciones.size();
                Paragraph promedioP = new Paragraph(String.format("\n\nPromedio: %.2f", promedio))
                        .setFontSize(14)
                        .setBold();
                document.add(promedioP);
            }

            document.close();

            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generando boletín PDF: " + e.getMessage(), e);
        }
    }
}
