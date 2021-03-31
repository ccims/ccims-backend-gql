CREATE FUNCTION update_last_modified_at_function()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    t_name text;
BEGIN
    FOR t_name IN
        SELECT table_name FROM information_schema.columns WHERE column_name = 'last_modified_at'
    LOOP
        EXECUTE format('CREATE TRIGGER update_last_modified_at_trigger
                    BEFORE UPDATE ON %I
                    FOR EACH ROW EXECUTE FUNCTION update_last_modified_at_function()', t_name);
    END LOOP;
END;
$$ language 'plpgsql';


CREATE FUNCTION insert_ccims_user_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO relation_user_role (user_id, role_id) VALUES (NEW.id, '1');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_ccims_user_trigger BEFORE INSERT ON ccims_users FOR EACH ROW EXECUTE FUNCTION insert_ccims_user_function();