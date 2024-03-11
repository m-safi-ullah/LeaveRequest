<?php
header("Access-Control-Allow-Origin:* ");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

class DbConnect {
    private $server = 'localhost';
    private $dbname = 'sociajav_leaverequest';
    private $user = 'sociajav_leaverequest';
    private $pass = '5gU7Yr2rWbvaR6UVr9ZL';
    private $conn;

    function __construct() {
        $this->connect();
    }

    protected function connect() {
        try {
            $this->conn = new PDO("mysql:host={$this->server};dbname={$this->dbname}", $this->user, $this->pass);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }

    function __destruct() {
        if ($this->conn) {
            $this->conn = null;
        }
    }

    function db() {
		
        if (!$this->conn) {
            $this->connect();
        }
        return $this->conn;
    }
}
		  		

		// public function connect() {
		// 	try {
		// 		$conn = new PDO('mysql:host=' .$this->server .';dbname=' . $this->dbname, $this->user, $this->pass);
		// 		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		// 		return $conn;
		// 	} catch (\Exception $e) {
		// 		echo "Database Error: " . $e->getMessage();
		// 	}
		// }
?>

