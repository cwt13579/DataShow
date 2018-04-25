package com.demo.common;

import com.demo.common.model._MappingKit;
import com.demo.index.HelloController;
import com.demo.index.IndexController;
import com.demo.index.LoginController;
import com.jfinal.config.Constants;
import com.jfinal.config.Handlers;
import com.jfinal.config.Interceptors;
import com.jfinal.config.JFinalConfig;
import com.jfinal.config.Plugins;
import com.jfinal.config.Routes;
import com.jfinal.core.JFinal;
import com.jfinal.kit.PropKit;
import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.jfinal.plugin.druid.DruidPlugin;
import com.jfinal.render.ViewType;
import com.jfinal.template.Engine;
import com.wxb.datashow.modules.label.LabelController;
import com.wxb.datashow.modules.preorder.PreOrderController;
import com.wxb.datashow.modules.product.ProductController;
import com.wxb.datashow.modules.productrule.ProductRuleController;
import com.wxb.datashow.modules.tsg.TsgController;
import com.wxb.datashow.web.controller.EnumController;
import com.wxb.datashow.web.controller.PictureController;
import com.wxb.datashow.web.controller.SysDictController;
import com.wxinterface.service.WXController;

/**
 * 本 demo 仅表达最为粗浅的 jfinal 用法，更为有价值的实用的企业级用法
 * 详见 JFinal 俱乐部: http://jfinal.com/club
 * 
 * API引导式配置
 */
public class DemoConfig extends JFinalConfig {
	
	/**
	 * 运行此 main 方法可以启动项目，此main方法可以放置在任意的Class类定义中，不一定要放于此
	 * 
	 * 使用本方法启动过第一次以后，会在开发工具的 debug、run config 中自动生成
	 * 一条启动配置，可对该自动生成的配置再添加额外的配置项，例如 VM argument 可配置为：
	 * -XX:PermSize=64M -XX:MaxPermSize=256M
	 */
	public static void main(String[] args) {
		/**
		 * 特别注意：Eclipse 之下建议的启动方式
		 */
		JFinal.start("src/main/webapp", 80, "/", 5);
		
		/**
		 * 特别注意：IDEA 之下建议的启动方式，仅比 eclipse 之下少了最后一个参数
		 */
		// JFinal.start("src/main/webapp", 80, "/");
	}
	
	/**
	 * 配置常量
	 */
	public void configConstant(Constants me) {
		// 加载少量必要配置，随后可用PropKit.get(...)获取值
		PropKit.use("a_little_config.txt");
		me.setDevMode(PropKit.getBoolean("devMode", false));
		me.setViewType(ViewType.JSP); 							// 设置视图类型为Jsp，否则默认为FreeMarker
		 
	}
	
	/**
	 * 配置路由
	 */
	public void configRoute(Routes me) {
		me.add("/", IndexController.class ,"/modules/bin");	// 第三个参数为该Controller的视图存放路径
		me.add("/login", LoginController.class,"/modules/login");
		me.add("/tsg", TsgController.class);
		me.add("/hello", HelloController.class);
		me.add("/product", ProductController.class,"/modules/product");
		me.add("/productRule", ProductRuleController.class,"/modules/productrule");
		me.add("/upload", PictureController.class);
		me.add("/wxservice", WXController.class);
		me.add("/enum", EnumController.class);
		me.add("/preOrder", PreOrderController.class,"/modules/preorder");
		me.add("/sysDict", SysDictController.class,"/modules/sysdict");
		me.add("/label", LabelController.class,"/modules/label");
	}
	
	public void configEngine(Engine me) {
		 
	}
	
	/**
	 * 配置插件
	 */
	public void configPlugin(Plugins me) {
	  DruidPlugin dp = createDruidPlugin();
	  me.add(dp);
	  ActiveRecordPlugin arp = new ActiveRecordPlugin(dp);
	  me.add(arp);
	  _MappingKit.mapping(arp);
	}
	
	public static DruidPlugin createDruidPlugin() {
		return new DruidPlugin(PropKit.get("jdbcUrl"), PropKit.get("user"), PropKit.get("password").trim());
	}
	
	/**
	 * 配置全局拦截器
	 */
	public void configInterceptor(Interceptors me) {
		//me.add(new LoginInterceptor());
	}
	
	/**
	 * 配置处理器
	 */
	public void configHandler(Handlers me) {
		
	}
}
