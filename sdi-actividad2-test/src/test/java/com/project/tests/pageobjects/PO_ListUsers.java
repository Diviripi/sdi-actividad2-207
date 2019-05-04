package com.project.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

import static org.junit.Assert.assertTrue;
public class PO_ListUsers  extends PO_View{

    public static void clickDeleteButton(WebDriver driver){
        WebElement element= driver.findElement(By.id("delete-button"));
        element.click();
    }

    public static void countUsers(WebDriver driver,int numeroUsuarios){
        List<WebElement> elementos = PO_View.checkElement(driver, "free", "//input[@type='checkbox']");
        assertTrue("El numero de usuarios no coincide",elementos.size()==numeroUsuarios);
    }

    public static void borrarUsuario(WebDriver driver,int... usuarios){
        List<WebElement> elementos = PO_View.checkElement(driver, "free", "//input[@type='checkbox']");
        for(int u:usuarios){
            elementos.get(u).click();
        }
        clickDeleteButton(driver);


    }
}
