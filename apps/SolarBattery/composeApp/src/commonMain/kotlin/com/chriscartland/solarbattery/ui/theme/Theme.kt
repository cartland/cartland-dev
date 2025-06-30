package com.chriscartland.solarbattery.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = DarkGreen400,
    secondary = DarkCyan400,
    tertiary = DarkIndigo400,
    background = DarkGray900,
    surface = DarkGray800,
    onPrimary = Color.Black,
    onSecondary = Color.Black,
    onTertiary = Color.Black,
    onBackground = Color.White,
    onSurface = Color.White,
    onSurfaceVariant = DarkGray400,
    error = DarkErrorRed,
    onError = Color.Black,
    outline = DarkGray700,
)

private val LightColorScheme = lightColorScheme(
    primary = LightGreen600,
    secondary = LightCyan600,
    tertiary = LightIndigo600,
    background = LightGray50,
    surface = White,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onTertiary = Color.White,
    onBackground = Color.Black,
    onSurface = Color.Black,
    onSurfaceVariant = Color.Gray,
    error = LightErrorRed,
    onError = Color.White,
    outline = LightGray100,
)

@Composable
fun SolarBatteryTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colorScheme = if (darkTheme) {
        DarkColorScheme
    } else {
        DarkColorScheme
//        LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content,
    )
}
