package co.udistrital.academia.util;

import co.udistrital.academia.entity.Calificacion;
import co.udistrital.academia.entity.Estudiante;
import co.udistrital.academia.entity.Grupo;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class PdfGenerator {

    // Color del header #E6F2FF (RGB: 230, 242, 255)
    private static final DeviceRgb HEADER_COLOR = new DeviceRgb(230, 242, 255);
    private static final DeviceRgb BORDER_COLOR = new DeviceRgb(200, 200, 200);
    private static final DeviceRgb TEXT_PRIMARY = new DeviceRgb(33, 33, 33);
    private static final DeviceRgb TEXT_SECONDARY = new DeviceRgb(102, 102, 102);

    public byte[] generarListadoGrupo(Grupo grupo) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Fuentes (Helvetica es similar a Inter y está incluida)
            PdfFont fontRegular = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont fontBold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

            // Agregar header con logo y título
            addHeader(document, fontBold, "LISTADO DE GRUPO");

            // Información del grupo en tabla estilizada
            Table infoTable = new Table(UnitValue.createPercentArray(new float[]{1, 3}));
            infoTable.setWidth(UnitValue.createPercentValue(100));
            infoTable.setMarginTop(20);
            infoTable.setMarginBottom(20);

            addInfoRow(infoTable, "Nombre del Grupo:", grupo.getNombre(), fontBold, fontRegular);
            addInfoRow(infoTable, "Grado:", grupo.getGrado(), fontBold, fontRegular);
            addInfoRow(infoTable, "Profesor:", grupo.getProfesor().getNombre(), fontBold, fontRegular);
            addInfoRow(infoTable, "Capacidad:", grupo.getEstudiantes().size() + " / " + grupo.getCapacidad() + " estudiantes", fontBold, fontRegular);
            addInfoRow(infoTable, "Estado:", grupo.getEstado().name(), fontBold, fontRegular);

            document.add(infoTable);

            // Título de la tabla de estudiantes
            Paragraph tableTitle = new Paragraph("Listado de Estudiantes")
                    .setFont(fontBold)
                    .setFontSize(14)
                    .setMarginTop(20)
                    .setMarginBottom(10)
                    .setFontColor(TEXT_PRIMARY);
            document.add(tableTitle);

            // Tabla de estudiantes con estilos
            float[] columnWidths = {0.5f, 2.5f, 2.5f, 1.5f, 1.5f};
            Table table = new Table(UnitValue.createPercentArray(columnWidths));
            table.setWidth(UnitValue.createPercentValue(100));

            // Headers con estilo
            addHeaderCell(table, "No.", fontBold);
            addHeaderCell(table, "Nombre", fontBold);
            addHeaderCell(table, "Apellido", fontBold);
            addHeaderCell(table, "Grado", fontBold);
            addHeaderCell(table, "Estado", fontBold);

            // Datos con estilos alternados
            int index = 1;
            for (Estudiante est : grupo.getEstudiantes()) {
                boolean isEven = index % 2 == 0;
                addDataCell(table, String.valueOf(index++), fontRegular, isEven);
                addDataCell(table, est.getNombre(), fontRegular, isEven);
                addDataCell(table, est.getApellido(), fontRegular, isEven);
                addDataCell(table, est.getGrado(), fontRegular, isEven);
                addDataCell(table, est.getEstado().name(), fontRegular, isEven);
            }

            document.add(table);

            // Footer
            addFooter(document, fontRegular);

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

            PdfFont fontRegular = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont fontBold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

            // Header
            addHeader(document, fontBold, "BOLETÍN DE CALIFICACIONES");

            // Información del estudiante
            Table infoTable = new Table(UnitValue.createPercentArray(new float[]{1, 3}));
            infoTable.setWidth(UnitValue.createPercentValue(100));
            infoTable.setMarginTop(20);
            infoTable.setMarginBottom(20);

            addInfoRow(infoTable, "Estudiante:", estudiante.getNombre() + " " + estudiante.getApellido(), fontBold, fontRegular);
            addInfoRow(infoTable, "Grado:", estudiante.getGrado(), fontBold, fontRegular);
            addInfoRow(infoTable, "Periodo:", periodo != null ? "Periodo " + periodo : "Todos los periodos", fontBold, fontRegular);
            
            if (estudiante.getGrupo() != null) {
                addInfoRow(infoTable, "Grupo:", estudiante.getGrupo().getNombre(), fontBold, fontRegular);
            }

            document.add(infoTable);

            if (calificaciones.isEmpty()) {
                Paragraph noData = new Paragraph("No hay calificaciones registradas para este periodo.")
                        .setFont(fontRegular)
                        .setFontSize(12)
                        .setFontColor(TEXT_SECONDARY)
                        .setTextAlignment(TextAlignment.CENTER)
                        .setMarginTop(40);
                document.add(noData);
            } else {
                // Agrupar calificaciones por periodo
                Map<Integer, List<Calificacion>> calificacionesPorPeriodo = calificaciones.stream()
                        .collect(Collectors.groupingBy(Calificacion::getPeriodo));

                for (Integer per : calificacionesPorPeriodo.keySet().stream().sorted().toList()) {
                    List<Calificacion> cals = calificacionesPorPeriodo.get(per);

                    // Título del periodo
                    Paragraph periodoTitle = new Paragraph("Periodo " + per)
                            .setFont(fontBold)
                            .setFontSize(14)
                            .setMarginTop(20)
                            .setMarginBottom(10)
                            .setFontColor(TEXT_PRIMARY);
                    document.add(periodoTitle);

                    // Tabla de calificaciones
                    float[] columnWidths = {4f, 2f, 1.5f};
                    Table table = new Table(UnitValue.createPercentArray(columnWidths));
                    table.setWidth(UnitValue.createPercentValue(100));

                    addHeaderCell(table, "Logro", fontBold);
                    addHeaderCell(table, "Categoría", fontBold);
                    addHeaderCell(table, "Calificación", fontBold);

                    double suma = 0;
                    int index = 0;
                    for (Calificacion cal : cals) {
                        boolean isEven = index % 2 == 0;
                        addDataCell(table, cal.getLogro().getNombre(), fontRegular, isEven);
                        addDataCell(table, cal.getLogro().getCategoria().name(), fontRegular, isEven);
                        addDataCell(table, String.format("%.2f", cal.getValor()), fontRegular, isEven);
                        suma += cal.getValor();
                        index++;
                    }

                    document.add(table);

                    // Promedio del periodo
                    double promedioPeriodo = suma / cals.size();
                    String estado = promedioPeriodo >= 3.0 ? "APROBADO" : "REPROBADO";
                    DeviceRgb estadoColorAprobado = new DeviceRgb(34, 139, 34);
                    DeviceRgb estadoColorReprobado = new DeviceRgb(220, 20, 60);
                    DeviceRgb estadoColor = promedioPeriodo >= 3.0 ? estadoColorAprobado : estadoColorReprobado;

                    Table promedioTable = new Table(UnitValue.createPercentArray(new float[]{3, 1, 2}));
                    promedioTable.setWidth(UnitValue.createPercentValue(100));
                    promedioTable.setMarginTop(10);

                    promedioTable.addCell(new Cell().setBorder(Border.NO_BORDER).add(new Paragraph("")));
                    promedioTable.addCell(new Cell()
                            .add(new Paragraph("Promedio:").setFont(fontBold).setFontSize(12))
                            .setTextAlignment(TextAlignment.RIGHT)
                            .setBorder(Border.NO_BORDER)
                            .setPaddingRight(10));
                    promedioTable.addCell(new Cell()
                            .add(new Paragraph(String.format("%.2f - %s", promedioPeriodo, estado))
                                    .setFont(fontBold)
                                    .setFontSize(12)
                                    .setFontColor(estadoColor))
                            .setTextAlignment(TextAlignment.LEFT)
                            .setBorder(Border.NO_BORDER));

                    document.add(promedioTable);
                }

                // Promedio general si hay múltiples periodos
                if (calificacionesPorPeriodo.size() > 1) {
                    double sumaTotal = calificaciones.stream().mapToDouble(Calificacion::getValor).sum();
                    double promedioGeneral = sumaTotal / calificaciones.size();
                    String estadoGeneral = promedioGeneral >= 3.0 ? "APROBADO" : "REPROBADO";
                    DeviceRgb estadoColor = promedioGeneral >= 3.0 ? new DeviceRgb(34, 139, 34) : new DeviceRgb(220, 20, 60);

                    Paragraph generalTitle = new Paragraph("Promedio General del Año")
                            .setFont(fontBold)
                            .setFontSize(16)
                            .setMarginTop(30)
                            .setMarginBottom(10)
                            .setTextAlignment(TextAlignment.CENTER)
                            .setFontColor(TEXT_PRIMARY);
                    document.add(generalTitle);

                    Paragraph promedioGeneral1 = new Paragraph(String.format("%.2f - %s", promedioGeneral, estadoGeneral))
                            .setFont(fontBold)
                            .setFontSize(18)
                            .setTextAlignment(TextAlignment.CENTER)
                            .setFontColor(estadoColor);
                    document.add(promedioGeneral1);
                }
            }

            // Footer
            addFooter(document, fontRegular);

            document.close();

            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generando boletín PDF: " + e.getMessage(), e);
        }
    }

    private void addHeader(Document document, PdfFont fontBold, String titulo) throws IOException {
        // Tabla para el header con logo y título
        Table headerTable = new Table(UnitValue.createPercentArray(new float[]{1, 4}));
        headerTable.setWidth(UnitValue.createPercentValue(100));
        headerTable.setBackgroundColor(HEADER_COLOR);
        headerTable.setPadding(15);

        // Logo placeholder (puedes agregar imagen real aquí)
        Cell logoCell = new Cell()
                .add(new Paragraph("JARDÍN APRENDIENDO JUNTOS")
                        .setFont(fontBold)
                        .setFontSize(18)
                        .setFontColor(TEXT_PRIMARY)
                        .setTextAlignment(TextAlignment.CENTER))
                .setVerticalAlignment(VerticalAlignment.MIDDLE)
                .setBorder(Border.NO_BORDER);
        headerTable.addCell(logoCell);

        // Título
        Cell titleCell = new Cell()
                .add(new Paragraph(titulo)
                        .setFont(fontBold)
                        .setFontSize(20)
                        .setFontColor(TEXT_PRIMARY))
                .add(new Paragraph("Academia UD - Sistema de Gestión Académica")
                        .setFont(fontBold)
                        .setFontSize(10)
                        .setFontColor(TEXT_SECONDARY)
                        .setMarginTop(5))
                .setVerticalAlignment(VerticalAlignment.MIDDLE)
                .setBorder(Border.NO_BORDER);
        headerTable.addCell(titleCell);

        document.add(headerTable);
    }

    private void addInfoRow(Table table, String label, String value, PdfFont fontBold, PdfFont fontRegular) {
        table.addCell(new Cell()
                .add(new Paragraph(label).setFont(fontBold).setFontSize(10).setFontColor(TEXT_PRIMARY))
                .setBorder(Border.NO_BORDER)
                .setPadding(5));
        table.addCell(new Cell()
                .add(new Paragraph(value).setFont(fontRegular).setFontSize(10).setFontColor(TEXT_SECONDARY))
                .setBorder(Border.NO_BORDER)
                .setPadding(5));
    }

    private void addHeaderCell(Table table, String text, PdfFont fontBold) {
        Cell cell = new Cell()
                .add(new Paragraph(text).setFont(fontBold).setFontSize(10).setFontColor(ColorConstants.WHITE))
                .setBackgroundColor(new DeviceRgb(41, 128, 185))
                .setTextAlignment(TextAlignment.CENTER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE)
                .setPadding(8)
                .setBorder(new SolidBorder(BORDER_COLOR, 1));
        table.addCell(cell);
    }

    private void addDataCell(Table table, String text, PdfFont fontRegular, boolean isEven) {
        DeviceRgb bgColorEven = new DeviceRgb(249, 249, 249);
        DeviceRgb bgColorOdd = new DeviceRgb(255, 255, 255);
        DeviceRgb bgColor = isEven ? bgColorEven : bgColorOdd;
        Cell cell = new Cell()
                .add(new Paragraph(text).setFont(fontRegular).setFontSize(9).setFontColor(TEXT_PRIMARY))
                .setBackgroundColor(bgColor)
                .setTextAlignment(TextAlignment.CENTER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE)
                .setPadding(6)
                .setBorder(new SolidBorder(BORDER_COLOR, 0.5f));
        table.addCell(cell);
    }

    private void addFooter(Document document, PdfFont fontRegular) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String fecha = LocalDate.now().format(formatter);

        Paragraph footer = new Paragraph("Documento generado el " + fecha + " - Academia UD")
                .setFont(fontRegular)
                .setFontSize(8)
                .setFontColor(TEXT_SECONDARY)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(30);
        document.add(footer);
    }
}
