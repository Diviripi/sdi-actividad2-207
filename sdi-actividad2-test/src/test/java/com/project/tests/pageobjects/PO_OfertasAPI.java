package com.project.tests.pageobjects;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

import static org.junit.Assert.assertTrue;

public class PO_OfertasAPI  extends PO_NavView{
    public static void contarOfertas(WebDriver driver, int numeroOfertas) {
        List<WebElement> elementos = PO_View.checkElement(driver, "free", "//td[contains(text(),'Descripcion')]");
        assertTrue("El numero de ofertas no coincide",elementos.size()==numeroOfertas);
    }

    public static void mensajeOferta(WebDriver driver, String nombreOferta) {
        List<WebElement> elementos = PO_View.checkElement(driver, "free",
                "//td[contains(text(),'"+nombreOferta+"')]/../td[position()=5]");
        elementos.get(0).click();
    }
}
