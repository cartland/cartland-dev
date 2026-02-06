package com.chriscartland.temperature

import java.io.File
import javax.imageio.ImageIO

fun main(args: Array<String>) {
    val cliArgs = parseCliArgs(args)

    println("Loading data from: ${cliArgs.dataPath}")
    val data = parseCsv(cliArgs.dataPath)
    println("Loaded ${data.size} temperature records")

    println("Loading baseline from: ${cliArgs.baselinePath}")
    val baseline = parseBaseline(cliArgs.baselinePath)

    println("Loading colors from: ${cliArgs.colorsPath}")
    val colorConfig = parseColorConfig(cliArgs.colorsPath)

    println("Rendering ${cliArgs.mode} visualization (${cliArgs.width}x${cliArgs.scale} scale)...")
    val image = renderGrid(
        data = data,
        baseline = baseline,
        colorConfig = colorConfig,
        mode = cliArgs.mode,
        baseWidth = cliArgs.width,
        scale = cliArgs.scale,
    )

    val outputFile = File(cliArgs.outputPath)
    ImageIO.write(image, "PNG", outputFile)
    println("Image saved to: ${outputFile.absolutePath} (${image.width}x${image.height})")
}
