package com.project.tests;


import com.project.tests.pageobjects.*;
import org.junit.*;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;

import java.util.List;

import static org.junit.Assert.assertEquals;
//Ordenamos las pruebas por el nombre del método
@FixMethodOrder(MethodSorters.NAME_ASCENDING)

public class ProjectTests {




    // En Windows (Debe ser la versión 65.0.1 y desactivar las actualizacioens
    // automáticas)):
    static String PathFirefox64 = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
    static String Geckdriver022 = "geckodriver024win64.exe";
    // En MACOSX (Debe ser la versión 65.0.1 y desactivar las actualizacioens
    // automáticas):
    // static String PathFirefox65 =
    // "/Applications/Firefox.app/Contents/MacOS/firefox-bin";
    // static String Geckdriver024 = "/Users/delacal/selenium/geckodriver024mac";
    // Común a Windows y a MACOSX
    static WebDriver driver = getDriver(PathFirefox64, Geckdriver022);
    static String URL = "http://localhost:8081";
    static String DATABASE_RESET_URL="http://localhost:8081/database/reset";

    public static WebDriver getDriver(String PathFirefox, String Geckdriver) {
        System.setProperty("webdriver.firefox.bin", PathFirefox);
        System.setProperty("webdriver.gecko.driver", Geckdriver);
        WebDriver driver = new FirefoxDriver();
        return driver;
    }

    // Antes de cada prueba se navega al URL home de la aplicaciónn
    @Before
    public void setUp() {
        initdb();
        driver.navigate().to(URL);

    }

    public void initdb() {
        driver.navigate().to(DATABASE_RESET_URL);


    }

    // Después de cada prueba se borran las cookies del navegador
    @After
    public void tearDown() {
        driver.manage().deleteAllCookies();
    }

    // Antes de la primera prueba
    @BeforeClass
    static public void begin() {
    }

    // Al finalizar la última prueba
    @AfterClass
    static public void end() {
        // Cerramos el navegador al finalizar las pruebas
        driver.quit();
    }

    //Registro del usuario con datos validos
    @Test
    public void PR01() {
        PO_HomeView.clickOption(driver, "register", "class", "btn btn-primary");
        PO_RegisterView.fillForm(driver, "usuario@email.com", "usuario", "usuario", "123456", "123456");
        PO_View.checkElement(driver, "text", "My offers");
    }

    //Registro de Usuario con datos invalidos (email vacio,nombre vacio,apellidos vacios,contraseña mal repetida)
    @Test
    public void PR02() {
        PO_HomeView.clickOption(driver, "register", "class", "btn btn-primary");
        PO_RegisterView.fillForm(driver, "", "", "", "", "");
      //  PO_View.checkElement(driver, "text", "Registrar");
        PO_RegisterView.fillForm(driver, "email@email.com", "repeticion invalida", "repeticion invalida",
                "123", "321");
        PO_View.checkElement(driver, "text", "match");
    }

    //Usuaio ya existente (admin)
    @Test
    public void PR03() {
        PO_HomeView.clickOption(driver, "register", "class", "btn btn-primary");
        PO_RegisterView.fillForm(driver, "admin@admin.com", "Ya existente", "existente", "123", "123");
        PO_View.checkElement(driver, "text", "Email incorrecto");
    }

    //Inicio de sesion valido
    @Test
    public void PR04() {
        //PO_HomeView.clickOption(driver, "signup", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver,  "user0@email.com", "user");
        PO_View.checkElement(driver, "text", "My offers");

    }

    //Inicio de sesion con datos invalidos (email existente,pass incorrecta)
    @Test
    public void PR05() {
        PO_LoginView.fillForm(driver,  "user0@email.com", "nouser");
        PO_View.checkElement(driver, "text", "incorrecto");
    }

    //Inicio de sesion con datos invalidos (email vacio,pass vacia)
    @Test
    public void PR06() {
        PO_LoginView.fillForm(driver,  "", "nouser");
        PO_View.checkElement(driver ,"free","//button[contains(text(),'Login')]");
        PO_LoginView.fillForm(driver,  "user0@email.com", "");
        PO_View.checkElement(driver ,"free","//button[contains(text(),'Login')]");
    }

    //inicio de sesion con datos invalidos(email no existente)
    @Test
    public void PR07() {
        PO_LoginView.fillForm(driver,  "noexiste@email.com", "nouser");
        PO_View.checkElement(driver, "text", "incorrecto");

    }

    //inicio de sesion y posterior logout
    @Test
    public void PR08() {
        PO_LoginView.fillForm(driver,  "user0@email.com", "user");
        PO_View.checkElement(driver, "text", "My offers");
        PO_HomeView.clickOption(driver, "logout", "class", "btn btn-primary");
        PO_LoginView.checkElement(driver, "text", "Identificación");

    }

    //no aparece el boton de logout si no esta autenticado
    @Test
    public void PR09() {
        PO_View.elementoNoPresenteEnLaPagina(driver,"logout");//falla porque encuentra el texto en el script
        //pero en realidad no esta en la pagina

    }

    //Mostrar listado de usuarios y ver que se muestran todos, tambien comprobamos aqui que el admin tiene opciones
    //de admin
    @Test
    public void PR10() {

        PO_LoginView.fillForm(driver, "admin@admin.com", "admin");
        PO_HomeView.clickOption(driver, "/users/list", "class", "btn btn-primary");
        PO_View.checkElement(driver,"text","Users");
        PO_ListUsers.countUsers(driver,5);//5 mas el admin
    }

    //borrar primer usuario
    @Test
    public void PR11() {
        PO_LoginView.fillForm(driver, "admin@admin.com", "admin");
        PO_HomeView.clickOption(driver, "/users/list", "class", "btn btn-primary");
        PO_View.checkElement(driver,"text","Users");
        PO_ListUsers.countUsers(driver,5);//5 mas el admin
        PO_ListUsers.borrarUsuario(driver,0);


        PO_ListUsers.countUsers(driver,4);//5 mas el admin
        PO_View.elementoNoPresenteEnLaPagina(driver,"user0");

    }

    //borrar ultimo usuario
    @Test
    public void PR12() {
        PO_LoginView.fillForm(driver, "admin@admin.com", "admin");
        PO_HomeView.clickOption(driver, "/users/list", "class", "btn btn-primary");
        PO_View.checkElement(driver,"text","Users");
        PO_ListUsers.countUsers(driver,5);//5 mas el admin
        PO_ListUsers.borrarUsuario(driver,4);


        PO_ListUsers.countUsers(driver,4);
        PO_View.elementoNoPresenteEnLaPagina(driver,"user4");


    }

    //borar 3 usuarios
    @Test
    public void PR13(){
        PO_LoginView.fillForm(driver, "admin@admin.com", "admin");
        PO_HomeView.clickOption(driver, "/users/list", "class", "btn btn-primary");
        PO_View.checkElement(driver,"text","Users");
        PO_ListUsers.countUsers(driver,5);//5 mas el admin
        PO_ListUsers.borrarUsuario(driver,0,1,2);


        PO_ListUsers.countUsers(driver,2);
        PO_View.elementoNoPresenteEnLaPagina(driver,"user0");
        PO_View.elementoNoPresenteEnLaPagina(driver,"user1");
        PO_View.elementoNoPresenteEnLaPagina(driver,"user2");

    }

    //nueva oferta y ver que aparece
    @Test
    public void PR14(){

        PO_LoginView.fillForm(driver, "user0@email.com", "user");

        PO_HomeView.clickOption(driver, "/offers/addOffer", "class", "btn btn-primary");

        PO_AddProduct.rellenarFormulario(driver,"NuevoTitulo","Descripcion","10");
        //redirigido a mis ofertas
        PO_View.checkElement(driver,"text","NuevoTitulo");

    }

    //rellenar oferta con datos invalidos, campo vacio

    @Test
    public void PR15(){
        PO_LoginView.fillForm(driver, "user0@email.com", "user");
        PO_HomeView.clickOption(driver, "/offers/addOffer", "class", "btn btn-primary");
        PO_AddProduct.rellenarFormulario(driver,"","Titulo vacio","10");
        //redirigido a mis ofertas
        PO_HomeView.checkElement(driver,"free","//h2[contains(text(),'Add')]");
    }

    //Ir al formulario de alta de oferta, rellenarla con datos validos, y comprobar que la oferta se ha añadido al
    //listado de ofertas del usuario
    @Test
    public void PR16(){
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "javi@email.com", "123456");

        List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'products-menu')]/a");
        elementos.get(0).click();
        // Esperamos a aparezca la opción de desconectar
        elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/sales/addProduct')]");
        elementos.get(0).click();

        PO_AddProduct.rellenarFormulario(driver,"NuevoElemento","Una descripcion","12");
        PO_AddProduct.checkElement(driver,"text","NuevoElemento");
    }

    //Ir al formulario de alta de oferta, rellenarla con datos invalidos, y comprobar que se muestra el error en la pagina
    @Test
    public void PR17(){
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "javi@email.com", "123456");

        List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'products-menu')]/a");
        elementos.get(0).click();
        // Esperamos a aparezca la opción de desconectar
        elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/sales/addProduct')]");
        elementos.get(0).click();

        PO_AddProduct.rellenarFormulario(driver,"","","");
        PO_AddProduct.checkElement(driver,"text","Crear oferta");
    }

    //Mostrar las ofertas de un usuario y comprobar que se muestran todas sus ofertas
    @Test
    public void PR18(){
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "javi@email.com", "123456");

        List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'products-menu')]/a");
        elementos.get(0).click();
        // Esperamos a aparezca la opción de desconectar
        elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/sales/list')]");
        elementos.get(0).click();

        elementos = PO_View
                .checkElement(driver, "free", "//tbody/tr");
        assertEquals(3,elementos.size());

    }

    //Borrar primera oferta de un usuario, comprobar que se borra
    @Test
    public void PR19(){
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "javi@email.com", "123456");

        List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'products-menu')]/a");
        elementos.get(0).click();
        String elementoAEliminar=PO_View.checkElement(driver,"free","//td").get(0).getText();
        elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/sales/delete')]");

        elementos.get(0).click();

        elementos = PO_View
                .checkElement(driver, "free", "//tbody/tr");
        assertEquals(2,elementos.size());
        PO_View.elementoNoPresenteEnLaPagina(driver,elementoAEliminar);

    }

    //Borrar ultima oferta de un usuario, comprobar que se borra
    @Test
    public void PR20(){
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "javi@email.com", "123456");

        List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'products-menu')]/a");
        elementos.get(0).click();

        List<WebElement> elementosABorrar=PO_View.checkElement(driver,"free","//td");
        String elementoAEliminar=elementosABorrar.get(elementosABorrar.size()-3).getText();//Obtenemos la antepenultima
        //td, con su texto en el interior, que sera el elemento que se borrara y cuyo texto debemos comprobar
        //que ya no existe

        elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/sales/delete')]");


        elementos.get(elementos.size()-1).click();

        elementos = PO_View
                .checkElement(driver, "free", "//tbody/tr");
        assertEquals(2,elementos.size());
        PO_View.elementoNoPresenteEnLaPagina(driver,elementoAEliminar);

    }

    //Buscar ofertas con el cuadro de busqueda vacio y comprobar que se muestran las ofertas del sistema
    @Test
    public void PR21(){
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "javi@email.com", "123456");

        List<WebElement> elementos = PO_View.checkElement(driver, "free", "//a[contains(@href,'/buy/list')]");
        elementos.get(0).click();

        PO_BuyList.rellenarCuadroDeBusqueda(driver,"");

       elementos = PO_View
                .checkElement(driver, "free", "//tbody/tr");

        assertEquals(5,elementos.size());//5 por hoja como  maximo
    }

    //Buscar ofertas con el cuadro de busqueda algo que no exista y comprobar que no se mustra nada
    @Test
    public void PR22(){
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "javi@email.com", "123456");

        List<WebElement> elementos = PO_View.checkElement(driver, "free", "//a[contains(@href,'/buy/list')]");
        elementos.get(0).click();

        PO_BuyList.rellenarCuadroDeBusqueda(driver,"AlgoQueNoExiste");


        List<WebElement> list = driver.findElements(By.tagName("td"));


        assertEquals(0,list.size());
    }

  }