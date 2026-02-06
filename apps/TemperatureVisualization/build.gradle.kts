plugins {
    kotlin("jvm") version "2.0.21"
    application
}

group = "com.chriscartland.temperature"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.google.code.gson:gson:2.11.0")
    implementation("org.jetbrains.kotlinx:kotlinx-cli:0.3.6")

    testImplementation(kotlin("test"))
}

application {
    mainClass.set("com.chriscartland.temperature.MainKt")
}

tasks.test {
    useJUnitPlatform()
}

kotlin {
    jvmToolchain(17)
}
