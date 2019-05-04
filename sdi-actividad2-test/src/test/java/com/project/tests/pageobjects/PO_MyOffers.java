package com.project.tests.pageobjects;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

import static org.junit.Assert.assertTrue;

public class PO_MyOffers  extends PO_NavView{
    static public void countOffers(WebDriver driver,int numeroOfertas){
        List<WebElement> elementos = PO_View.checkElement(driver, "free", "//a[contains(text(),'Eliminar')]");
        assertTrue("El numero de usuarios no coincide",elementos.size()==numeroOfertas);
    }
    static public void borrarOferta(WebDriver driver, int numeroOferta){
        List<WebElement> elementos = PO_View.checkElement(driver, "free", "//a[contains(text(),'Eliminar')]");
        elementos.get(numeroOferta).click();
    }
}
