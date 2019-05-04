package com.project.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_Conversation extends PO_View {

    public static void rellenarMensaje(WebDriver driver, String message) {
        WebElement cuadroMensaje = driver.findElement(By.name("message"));
        cuadroMensaje.click();
        cuadroMensaje.clear();
        cuadroMensaje.sendKeys(message);
        By boton = By.className("btn");
        driver.findElement(boton).click();
    }
}
