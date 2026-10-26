package com.cid.sidae.migration;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class LegacyMappingsTest {

    @Test
    void mapsStatuses() {
        assertThat(LegacyMappings.taskStatus("En progreso")).isEqualTo("EN_PROCESO");
        assertThat(LegacyMappings.taskStatus("Finalizada")).isEqualTo("COMPLETADA");
        assertThat(LegacyMappings.taskStatus(null)).isEqualTo("PENDIENTE");
        assertThat(LegacyMappings.folderStatus("Sin documentos")).isEqualTo("PENDIENTE");
        assertThat(LegacyMappings.folderStatus("Aprobado")).isEqualTo("APROBADO");
        assertThat(LegacyMappings.requestStatus("Validado")).isEqualTo("COMPLETADA");
        assertThat(LegacyMappings.requestStatus("Pendiente")).isEqualTo("RECIBIDA");
    }

    @Test
    void mapsFolderTypeFromLevel() {
        assertThat(LegacyMappings.folderTypeFromLevel("Postgrado")).isEqualTo("POSTGRADO");
        assertThat(LegacyMappings.folderTypeFromLevel("Pregrado")).isEqualTo("PREGRADO");
        assertThat(LegacyMappings.folderTypeFromLevel("Cursos Avanzados")).isEqualTo("PREGRADO");
        assertThat(LegacyMappings.folderTypeFromLevel(null)).isEqualTo("PREGRADO");
    }

    @Test
    void normalizesNamesIgnoringAccents() {
        assertThat(LegacyMappings.normalized("Cédula de identidad")).isEqualTo(LegacyMappings.normalized("Cedula de Identidad"));
        assertThat(LegacyMappings.normalized("  En   progreso ")).isEqualTo("en progreso");
    }

    @Test
    void extractsFileNameAndType() {
        assertThat(LegacyMappings.fileNameOf("https://files.uru.ve/docs/cedula.pdf?x=1")).isEqualTo("cedula.pdf");
        assertThat(LegacyMappings.fileNameOf("C:\\docs\\nota.png")).isEqualTo("nota.png");
        assertThat(LegacyMappings.contentTypeOf("cedula.pdf")).isEqualTo("application/pdf");
        assertThat(LegacyMappings.contentTypeOf("foto.jpeg")).isEqualTo("image/jpeg");
        assertThat(LegacyMappings.contentTypeOf("raro.xyz")).isEqualTo("application/octet-stream");
    }
}
