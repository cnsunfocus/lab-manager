package org.lab_manager.dao;

import org.lab_manager.entity.LabUse;

import java.util.List;

/**
 * Created by Silence on 2016/5/26.
 */
//实验室使用情况查询
public interface LabUseDao {
    public List<LabUse> getLabUseInfo(Integer room_id);
}