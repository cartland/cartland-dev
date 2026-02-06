package com.chriscartland.temperature

import java.io.File
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class CsvParserTest {

    @Test
    fun `parseCsv parses valid data`() {
        val tempFile = File.createTempFile("test-data", ".csv")
        tempFile.deleteOnExit()
        tempFile.writeText(
            """
            # Comment line
            Date,Anomaly
            185001,-0.68
            185002,-0.42
            202412,1.31
            """.trimIndent(),
        )

        val records = parseCsv(tempFile.absolutePath)
        assertEquals(3, records.size)

        assertEquals(1850, records[0].year)
        assertEquals(1, records[0].month)
        assertEquals(-0.68, records[0].anomaly)

        assertEquals(2024, records[2].year)
        assertEquals(12, records[2].month)
        assertEquals(1.31, records[2].anomaly)
    }

    @Test
    fun `parseCsv skips comment lines and header`() {
        val tempFile = File.createTempFile("test-data", ".csv")
        tempFile.deleteOnExit()
        tempFile.writeText(
            """
            # This is a comment
            # Another comment
            No commas here
            185001,-0.68
            """.trimIndent(),
        )

        val records = parseCsv(tempFile.absolutePath)
        assertEquals(1, records.size)
        assertEquals(1850, records[0].year)
    }

    @Test
    fun `parseCsv handles empty file`() {
        val tempFile = File.createTempFile("test-data", ".csv")
        tempFile.deleteOnExit()
        tempFile.writeText("")

        val records = parseCsv(tempFile.absolutePath)
        assertTrue(records.isEmpty())
    }

    @Test
    fun `parseCsv skips invalid lines`() {
        val tempFile = File.createTempFile("test-data", ".csv")
        tempFile.deleteOnExit()
        tempFile.writeText(
            """
            Date,Anomaly
            invalid,data
            185001,-0.68
            abc,xyz
            185002,-0.42
            """.trimIndent(),
        )

        val records = parseCsv(tempFile.absolutePath)
        assertEquals(2, records.size)
    }
}
