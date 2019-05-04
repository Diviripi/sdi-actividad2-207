package com.project.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

import static org.junit.Assert.assertTrue;

public class PO_BuyList  extends PO_View{

    public static void rellenarCuadroDeBusqueda(WebDriver driver,String textoBusqueda){
        WebElement cuadroBusqueda = driver.findElement(By.name("busqueda"));
        cuadroBusqueda.click();
        cuadroBusqueda.clear();
        cuadroBusqueda.sendKeys(textoBusqueda);
        By boton = By.className("btn");
        driver.findElement(boton).click();
    }

    public static void contarOfertas(WebDriver driver,int numeroOfertas){
        List<WebElement> elementos = PO_View.checkElement(driver, "free", "//td[contains(text(),'Descripcion')]");
        assertTrue("El numero de ofertas no coincide",elementos.size()==numeroOfertas);
    }


}
