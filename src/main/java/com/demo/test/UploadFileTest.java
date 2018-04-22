package com.demo.test;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

import com.aliyun.oss.OSSClient;
import com.aliyun.oss.model.PutObjectResult;

public class UploadFileTest {

  public static void main(String args[]) throws FileNotFoundException {
    File file = new File("D:\\pictures\\elephent.png");
    System.out.println(file.getName().substring(file.getName().lastIndexOf(".")+1));
  }
}
