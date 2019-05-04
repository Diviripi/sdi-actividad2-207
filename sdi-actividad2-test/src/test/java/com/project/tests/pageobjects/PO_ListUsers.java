package com.project.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_ListUsers  extends PO_View{

    public static void clickDeleteButton(WebDriver driver){
        WebElement element= driver.findElement(By.id("delete-button"));
        element.click();
    }
}
