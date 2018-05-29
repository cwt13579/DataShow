package com.wxb.datashow.es;

import java.net.InetAddress;

import org.apache.log4j.Logger;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.transport.client.PreBuiltTransportClient;

public class ESConnector {
	private final static Logger log = Logger.getLogger(ESConnector.class);
	
//	private Settings settings = Settings.builder()
//	        .put("client.transport.sniff", true)
//	        .put("cluster.name", "zy")
//	        .put("xpack.security.transport.ssl.enabled", false)
//            .put("xpack.security.user", "elastic:123456")
//            .put("client.transport.sniff", true)
//	        .build();
	private final static Settings settings = Settings.builder()
	        .put("client.transport.sniff", true)
	        .put("cluster.name", "lzuwxb")
	        .build();
	private final static ThreadLocal<Client> threadClient = new ThreadLocal<Client>();
	private final static String  transportAddr = "172.16.11.2";
	private final static Integer  transportPort = 9300;
	
	public static Client getConnection() {
	    Client client = (Client) threadClient.get();
	    try {
	      if (client == null) {
	    	   client = new PreBuiltTransportClient(settings)
	          .addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName(transportAddr), transportPort));
	        log.info("GET connection is succeed:[ES] " + transportAddr + ":" + transportPort);
	        threadClient.set(client);
	      }
	    } catch (Exception e) {
	      log.info("GET connection is failed:[ES] " + transportAddr + ":" + transportPort
	          + ",retry in 5s.");
	      log.error(e);
	      try {
	        Thread.sleep(5000);
	      } catch (InterruptedException e1) {
	        log.error(e1);
	      }
	      client = null;
	      client = getConnection();
	    }
	    return client;
	  }
}
