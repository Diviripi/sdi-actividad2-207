package com.project.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_AddProduct  extends PO_View{

    public static void rellenarFormulario(WebDriver driver,String titulop,String descripcionp,String preciop){

    WebElement titulo = driver.findElement(By.name("title"));
        titulo.click();
        titulo.clear();
        titulo.sendKeys(titulop);

    WebElement descripcion = driver.findElement(By.name("description"));
		descripcion.click();
		descripcion.clear();
		descripcion.sendKeys(descripcionp);

    WebElement precio = driver.findElement(By.name("price"));
		precio.click();
		precio.clear();
		precio.sendKeys(preciop);


    By boton = By.className("btn");
		driver.findElement(boton).click();
}}
