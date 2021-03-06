package org.lab_manager.service.serviceImp;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.lab_manager.entity.Role;
import org.lab_manager.service.ILoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.*;

/**
 * Created by xiaofeige on 2016/5/31.
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring-config.xml")
public class LoginServiceTest {
    @Autowired
    private ILoginService loginService;

    @Test
    public void login() throws Exception {
        Role role=loginService.login("admin","admin");
        System.out.println(role.getRole_name());
    }

}