package com.chriscartland.solarbattery

import java.text.NumberFormat
import java.util.Locale

internal actual fun formatNumber(number: Double): String = NumberFormat.getCurrencyInstance(Locale.US).format(number)
