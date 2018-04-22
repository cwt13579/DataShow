package com.demo.utils.fileupload;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.UUID;

import com.aliyun.oss.ClientException;
import com.aliyun.oss.OSSClient;
import com.aliyun.oss.OSSException;
import com.aliyun.oss.model.ObjectMetadata;
import com.aliyun.oss.model.PutObjectRequest;

public class OSSUploadUtil {

  private static OSSConfig config = new OSSConfig();

  public static String uploadFile(File file, String fileType) {
    config = config == null ? new OSSConfig() : config;
    String fileName =
        config.getPicLocation() + UUID.randomUUID().toString().toUpperCase().replace("-", "") + "."
            + fileType; // 文件名，根据UUID来
    return putObject(file, fileType, fileName);
  }

  private static String putObject(File file, String fileType, String fileName) {
    config = config == null ? new OSSConfig() : config;
    String url = null; // 默认null
    OSSClient ossClient = null;
    try {
      ossClient =
          new OSSClient(config.getEndpoint(), config.getAccessKeyId(), config.getAccessKeySecret());
      InputStream input = new FileInputStream(file);
      ObjectMetadata meta = new ObjectMetadata(); // 创建上传Object的Metadata
      meta.setContentType(OSSUploadUtil.contentType(fileType)); // 设置上传内容类型
      meta.setCacheControl("no-cache"); // 被下载时网页的缓存行为
      PutObjectRequest request =
          new PutObjectRequest(config.getBucketName(), fileName, input, meta); // 创建上传请求
      ossClient.putObject(request);
      url = config.getVisitURI() + "/" + fileName; // 上传成功再返回的文件路径
    } catch (OSSException oe) {
      oe.printStackTrace();
      return null;
    } catch (ClientException ce) {
      ce.printStackTrace();
      return null;
    } catch (FileNotFoundException e) {
      e.printStackTrace();
      return null;
    } finally {
      ossClient.shutdown();
    }
    return url;
  }

  private static String contentType(String fileType) {
    fileType = fileType.toLowerCase();
    String contentType = "";
    switch (fileType) {
      case "bmp":
        contentType = "image/bmp";
        break;
      case "gif":
        contentType = "image/gif";
        break;
      case "png":
      case "jpeg":
      case "jpg":
        contentType = "image/jpeg";
        break;
      case "html":
        contentType = "text/html";
        break;
      case "txt":
        contentType = "text/plain";
        break;
      case "vsd":
        contentType = "application/vnd.visio";
        break;
      case "ppt":
      case "pptx":
        contentType = "application/vnd.ms-powerpoint";
        break;
      case "doc":
      case "docx":
        contentType = "application/msword";
        break;
      case "xml":
        contentType = "text/xml";
        break;
      case "mp4":
        contentType = "video/mp4";
        break;
      default:
        contentType = "application/octet-stream";
        break;
    }
    return contentType;
  }
  
  public static void main(String args[]) {
    //PropKit.use("a_little_config.txt");
    File file = new File("D:\\pictures\\elephent.png");
    System.out.println(file.getName().substring(file.getName().lastIndexOf(".")+1));
    //uploadFile(file,file.getName().substring(file.getName().lastIndexOf(".")));
  }
}
