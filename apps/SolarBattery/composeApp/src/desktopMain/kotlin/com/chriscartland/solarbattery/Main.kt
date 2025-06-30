package com.chriscartland.solarbattery

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application

fun main() =
    application {
        Window(
            onCloseRequest = ::exitApplication,
            title = "Solar Battery",
        ) {
            App()
        }
    }
