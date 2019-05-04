package com.project.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_LoginViewAPI  extends PO_NavView{
    public static void fillForm(WebDriver driver, String emailp, String password) {
        WebElement email = driver.findElement(By.name("email"));
        email.click();
        email.clear();
        email.sendKeys(emailp);

        WebElement passwordElement = driver.findElement(By.name("password"));
        passwordElement.click();
        passwordElement.clear();
        passwordElement.sendKeys(password);


        //Pulsar el boton de Alta.
        By boton = By.id("boton-login");
        driver.findElement(boton).click();
    }
}
