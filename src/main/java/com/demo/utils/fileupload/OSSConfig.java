package com.demo.utils.fileupload;

import com.jfinal.kit.PropKit;

public class OSSConfig {
  private  String endpoint;       //连接区域地址  
  private  String accessKeyId;    //连接keyId  
  private  String accessKeySecret;    //连接秘钥  
  private  String bucketName;     //需要存储的bucketName  
  private  String picLocation;    //图片保存路径  
  private  String visitURI;       //访问域名
  
  public OSSConfig() {  
    this.endpoint = PropKit.get("endpoint");  
    this.bucketName = PropKit.get("bucketName");  
    this.picLocation = PropKit.get("picLocation");  
    this.accessKeyId = PropKit.get("accessKeyId");  
    this.accessKeySecret = PropKit.get("accessKeySecret"); 
    this.visitURI = PropKit.get("visitURI");  
}  
  
  public String getEndpoint() {
    return endpoint;
  }
  public void setEndpoint(String endpoint) {
    this.endpoint = endpoint;
  }
  public String getAccessKeyId() {
    return accessKeyId;
  }
  public void setAccessKeyId(String accessKeyId) {
    this.accessKeyId = accessKeyId;
  }
  public String getAccessKeySecret() {
    return accessKeySecret;
  }
  public void setAccessKeySecret(String accessKeySecret) {
    this.accessKeySecret = accessKeySecret;
  }
  public String getBucketName() {
    return bucketName;
  }
  public void setBucketName(String bucketName) {
    this.bucketName = bucketName;
  }
  public String getPicLocation() {
    return picLocation;
  }
  public void setPicLocation(String picLocation) {
    this.picLocation = picLocation;
  }

  public String getVisitURI() {
    return visitURI;
  }

  public void setVisitURI(String visitURI) {
    this.visitURI = visitURI;
  }
  
}
