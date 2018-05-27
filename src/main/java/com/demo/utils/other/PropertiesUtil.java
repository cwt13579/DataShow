package com.demo.utils.other;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import com.jfinal.kit.PathKit;
import com.jfinal.kit.StrKit;

/**
 * @author chenwentao@trustmo.com
 *
 * 2015-3-18
 */
public class PropertiesUtil {

  public static Properties loadPropertyFile(String file) {
    Properties properties;
    if (StrKit.isBlank(file))
        throw new IllegalArgumentException("Parameter of file can not be blank");
    if (file.contains(".."))
        throw new IllegalArgumentException("Parameter of file can not contains \"..\"");

    InputStream inputStream = null;
    String fullFile;    // String fullFile = PathUtil.getWebRootPath() + file;
    if (file.startsWith(File.separator))
        fullFile = PathKit.getWebRootPath() + File.separator + "WEB-INF" + file;
    else
        fullFile = PathKit.getWebRootPath() + File.separator + "WEB-INF" + File.separator + file;

    try {
        inputStream = new FileInputStream(new File(fullFile));
        Properties p = new Properties();
        p.load(inputStream);
        properties = p;
    } catch (FileNotFoundException e) {
        throw new IllegalArgumentException("Properties file not found: " + fullFile);
    } catch (IOException e) {
        throw new IllegalArgumentException("Properties file can not be loading: " + fullFile);
    }
    finally {
        try {if (inputStream != null) inputStream.close();} catch (IOException e) {e.printStackTrace();}
    }
    if (properties == null)
        throw new RuntimeException("Properties file loading failed: " + fullFile);
    return properties;
}
}
