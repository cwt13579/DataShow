package com.demo.plugins.quartz;

/**
 * @author chenwentao@trustmo.com
 *
 * 2015-3-18
 */
import java.util.Properties;

import org.quartz.Scheduler;
import org.quartz.impl.StdSchedulerFactory;

import com.jfinal.kit.PropKit;
import com.jfinal.plugin.IPlugin;

/**
 * Quartz插件
 * @author cwt
 */
public class QuartzPlugin implements IPlugin{


    /**默认配置文件**/
    private String config = "quartz.properties";
    public QuartzPlugin(){

    }

    public QuartzPlugin(String config){
        this.config = config;
    }

    @Override
    public boolean start() {
        try {
            //加载配置文件
            Properties props =  PropKit.use(config).getProperties();
           
            //实例化
            QuartzFactory.sf = new StdSchedulerFactory(props);
            //获取Scheduler
            Scheduler sched = QuartzFactory.sf.getScheduler();
                sched.start();
                return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean stop() {
        try {
            QuartzFactory.sf.getScheduler().shutdown(true);
            QuartzFactory.sf = null;
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
