CREATE FUNCTION update_last_modified_at_function()
RETURNS TRIGGER
LANGUAGE plpgsql AS
'
BEGIN
    NEW.last_modified_at = now();
    RETURN NEW;
END;
';

DO $$
DECLARE
    t_name text;
BEGIN
    FOR t_name IN
        SELECT table_name FROM information_schema.columns WHERE column_name = 'last_modified_at'
    LOOP
        EXECUTE format('CREATE TRIGGER update_last_modified_at_trigger
                    BEFORE UPDATE ON %I
                    FOR EACH ROW EXECUTE PROCEDURE update_last_modified_at_function()', t_name);
    END LOOP;
END;
$$ language 'plpgsql';