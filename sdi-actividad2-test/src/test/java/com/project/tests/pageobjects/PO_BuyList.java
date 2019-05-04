package com.project.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_BuyList  extends PO_View{

    public static void rellenarCuadroDeBusqueda(WebDriver driver,String textoBusqueda){
        WebElement cuadroBusqueda = driver.findElement(By.name("searchText"));
        cuadroBusqueda.click();
        cuadroBusqueda.clear();
        cuadroBusqueda.sendKeys(textoBusqueda);
        By boton = By.className("btn");
        driver.findElement(boton).click();
    }
}
