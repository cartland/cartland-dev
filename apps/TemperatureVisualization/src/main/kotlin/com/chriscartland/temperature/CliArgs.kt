package com.chriscartland.temperature

import kotlinx.cli.ArgParser
import kotlinx.cli.ArgType
import kotlinx.cli.default

data class CliArgs(
    val mode: String,
    val dataPath: String,
    val baselinePath: String,
    val colorsPath: String,
    val outputPath: String,
    val width: Int,
    val scale: Int,
)

fun parseCliArgs(args: Array<String>): CliArgs {
    val parser = ArgParser("temperature-visualization")

    val mode by parser.option(
        ArgType.String,
        shortName = "m",
        fullName = "mode",
        description = "Visualization mode: temperature, anomaly, filtered, filtered-5-month",
    ).default("temperature")

    val data by parser.option(
        ArgType.String,
        shortName = "d",
        fullName = "data",
        description = "Path to anomaly CSV file",
    )

    val baseline by parser.option(
        ArgType.String,
        shortName = "b",
        fullName = "baseline",
        description = "Path to baseline JSON file",
    )

    val colors by parser.option(
        ArgType.String,
        shortName = "c",
        fullName = "colors",
        description = "Path to color config JSON file",
    )

    val output by parser.option(
        ArgType.String,
        shortName = "o",
        fullName = "output",
        description = "Output PNG file path",
    ).default("output.png")

    val width by parser.option(
        ArgType.Int,
        shortName = "w",
        fullName = "width",
        description = "Base width in pixels",
    ).default(800)

    val scale by parser.option(
        ArgType.Int,
        shortName = "s",
        fullName = "scale",
        description = "Scale multiplier",
    ).default(8)

    parser.parse(args)

    requireNotNull(data) { "--data argument is required" }
    requireNotNull(baseline) { "--baseline argument is required" }
    requireNotNull(colors) { "--colors argument is required" }

    return CliArgs(
        mode = mode,
        dataPath = data!!,
        baselinePath = baseline!!,
        colorsPath = colors!!,
        outputPath = output,
        width = width,
        scale = scale,
    )
}
