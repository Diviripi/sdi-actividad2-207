package com.project.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class PO_DetallesOferta extends PO_NavView {
    public static void nuevaConvesacion(WebDriver driver) {
        List<WebElement> elementos = PO_View.checkElement(driver, "free", "//*[contains(text(),'conversacion')]");
        elementos.get(0).click();
    }

    public static void verChat(WebDriver driver) {
        List<WebElement> elementos = PO_View.checkElement(driver, "free", "//*[contains(text(),'Ver')]");

        elementos.get(0).click();
    }

    public static void enviarMensaje(WebDriver driver, String mensaje) {
        WebElement email = driver.findElement(By.id("typeBox"));
        email.click();
        email.clear();
        email.sendKeys(mensaje);

        WebElement botonEnviar = driver.findElement(By.id("botonEnviar"));
        botonEnviar.click();

    }
}
