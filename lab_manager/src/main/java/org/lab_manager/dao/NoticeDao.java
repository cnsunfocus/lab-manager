package org.lab_manager.dao;

import org.lab_manager.entity.Notice;
import org.springframework.stereotype.Repository;

/**
 * Created by Silence on 2016/5/24.
 */
@Repository
public interface NoticeDao {
    public Notice queryById(Integer id);

    public Notice insert(Integer id, String date, String content, String author);
}